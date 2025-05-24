import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.7';
import { Octokit } from 'npm:@octokit/rest@20.0.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Get auth user
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser(req.headers.get('Authorization')?.split(' ')[1] ?? '');

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Check if user is admin
    const { data: isAdmin, error: adminError } = await supabaseClient.rpc('is_admin', {
      user_id: user.id,
    });

    if (adminError || !isAdmin) {
      throw new Error('Unauthorized - Admin access required');
    }

    const { pageId } = await req.json();

    // Get page data
    const { data: page, error: pageError } = await supabaseClient
      .from('pages')
      .select('*')
      .eq('id', pageId)
      .single();

    if (pageError || !page) {
      throw new Error('Page not found');
    }

    // Initialize Octokit with GitHub token from environment
    const octokit = new Octokit({
      auth: Deno.env.get('GITHUB_TOKEN'),
    });

    // Prepare content for GitHub
    const content = {
      title: page.title,
      slug: page.slug,
      blocks: page.blocks,
      metadata: page.metadata,
    };

    const contentStr = JSON.stringify(content, null, 2);
    
    // Convert content to base64 safely handling UTF-8
    const contentBase64 = btoa(
      new TextEncoder()
        .encode(contentStr)
        .reduce((data, byte) => data + String.fromCharCode(byte), '')
    );

    // Get current file SHA if it exists
    let sha: string | undefined;
    try {
      const { data: existingFile } = await octokit.repos.getContent({
        owner: 'Starwars432',
        repo: 'Rossi',
        path: `content/pages/${page.slug}.json`,
      });
      
      if ('sha' in existingFile) {
        sha = existingFile.sha;
      }
    } catch (error) {
      console.log('File does not exist yet:', error);
    }

    // Commit to GitHub
    await octokit.repos.createOrUpdateFileContents({
      owner: 'Starwars432',
      repo: 'Rossi',
      path: `content/pages/${page.slug}.json`,
      message: `Update ${page.slug} page`,
      content: contentBase64,
      sha,
      committer: {
        name: 'Editor Bot',
        email: 'editor@manifestillusions.com',
      },
      author: {
        name: user.email || 'Editor User',
        email: user.email || 'editor@manifestillusions.com',
      },
    });

    // Update page status
    const { error: updateError } = await supabaseClient
      .from('pages')
      .update({
        is_draft: false,
        published_at: new Date().toISOString(),
      })
      .eq('id', pageId);

    if (updateError) {
      throw new Error('Failed to update page status');
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error syncing with GitHub:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});