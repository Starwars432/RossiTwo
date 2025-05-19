import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

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

    // Get GitHub settings
    const { data: settings, error: settingsError } = await supabaseClient
      .from('editor_settings')
      .select('github_token, github_repo')
      .eq('user_id', user.id)
      .single();

    if (settingsError || !settings?.github_token || !settings?.github_repo) {
      throw new Error('GitHub settings not configured');
    }

    // Prepare content for GitHub
    const content = {
      title: page.title,
      slug: page.slug,
      content: page.content,
      metadata: page.metadata,
    };

    const contentStr = JSON.stringify(content, null, 2);
    const contentBase64 = btoa(contentStr);

    // Get current file SHA (if exists)
    const [owner, repo] = settings.github_repo.split('/');
    const path = `content/pages/${page.slug}.json`;

    const getFileResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        headers: {
          'Authorization': `token ${settings.github_token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    let sha = undefined;
    if (getFileResponse.status === 200) {
      const fileData = await getFileResponse.json();
      sha = fileData.sha;
    }

    // Commit to GitHub
    const commitResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${settings.github_token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Update ${page.slug} page`,
          content: contentBase64,
          sha,
        }),
      }
    );

    if (!commitResponse.ok) {
      throw new Error('Failed to commit to GitHub');
    }

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
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});