import React, { useState, useEffect } from 'react';
import Joyride, { Step, CallBackProps } from 'react-joyride';
import { useLocalStorage } from '../../lib/hooks/useLocalStorage';

const steps: Step[] = [
  {
    target: '.editor-toolbar',
    content: 'Welcome to the Visual Editor! This toolbar contains all the tools you need to create and edit your content.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '.block-tools',
    content: 'Add different types of content blocks like text, images, and containers.',
    placement: 'bottom',
  },
  {
    target: '.responsive-preview',
    content: 'Preview how your content looks on different devices.',
    placement: 'bottom',
  },
  {
    target: '.component-library',
    content: 'Save and reuse your favorite components.',
    placement: 'right',
  },
  {
    target: '.media-library',
    content: 'Upload and manage your media files.',
    placement: 'right',
  },
  {
    target: '.theme-settings',
    content: 'Customize the look and feel of your site.',
    placement: 'right',
  },
  {
    target: '.github-sync',
    content: 'Sync your changes with GitHub.',
    placement: 'right',
  },
  {
    target: '.canvas',
    content: 'This is your editing canvas. Click and drag blocks to rearrange them.',
    placement: 'left',
  },
];

const Tutorial: React.FC = () => {
  const [run, setRun] = useState(false);
  const [hasSeenTutorial, setHasSeenTutorial] = useLocalStorage('hasSeenTutorial', false);

  useEffect(() => {
    if (!hasSeenTutorial) {
      setRun(true);
    }
  }, [hasSeenTutorial]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    if (data.status === 'finished' || data.status === 'skipped') {
      setRun(false);
      setHasSeenTutorial(true);
    }
  };

  return (
    <>
      <Joyride
        run={run}
        steps={steps}
        continuous
        showProgress
        showSkipButton
        styles={{
          options: {
            primaryColor: '#3B82F6',
            textColor: '#FFFFFF',
            backgroundColor: '#000000',
            arrowColor: '#000000',
            overlayColor: 'rgba(0, 0, 0, 0.85)',
          },
          tooltip: {
            padding: '1rem',
            borderRadius: '0.5rem',
            border: '1px solid rgba(96, 165, 250, 0.3)',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(8px)',
          },
          buttonNext: {
            backgroundColor: '#3B82F6',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
          },
          buttonBack: {
            color: '#60A5FA',
            marginRight: '0.5rem',
          },
          buttonSkip: {
            color: '#9CA3AF',
          },
        }}
        callback={handleJoyrideCallback}
      />
      {!hasSeenTutorial && (
        <button
          onClick={() => setRun(true)}
          className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition-colors"
        >
          Show Tutorial
        </button>
      )}
    </>
  );
};

export default Tutorial;