import { useState, useRef, useEffect } from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import copy from 'copy-to-clipboard';
import FullpageLoader from '../components/fullpage-loader';
import VideoPlayer from '../components/video-player';
import Layout from '../components/layout';
import ReportForm from '../components/report-form';
import { HOST_URL } from '../constants';

type Params = {
  id: string;
}

export const getStaticProps: GetStaticProps = async (context)  => {
  const { params } = context;
  const playbackId  = 'LaYV5UY5I8PuAstNsW6n5akP3WRCEWZSGQvvvyH01eZA';
  const poster = `https://image.mux.com/${playbackId}/thumbnail.png`;
  const shareUrl = `${HOST_URL}/v/${playbackId}`;

  return { props: { playbackId: 'LaYV5UY5I8PuAstNsW6n5akP3WRCEWZSGQvvvyH01eZA', shareUrl, poster } };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

type Props = {
  playbackId: string,
  shareUrl: string,
  poster: string
};

const META_TITLE = "The Oneness Play by Student Council";
const Playback: React.FC<Props> = ({ playbackId, shareUrl, poster }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [openReport, setOpenReport] = useState(false);
  const copyTimeoutRef = useRef<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  if (router.isFallback) {
    return (
      <Layout
        metaTitle="The Oneness Play by Student Council"
        image={"https://cloud-chv0h2jb1.vercel.app/0screenshot_2020-11-07_at_9.26.49_pm.png"}
        centered
        darkMode
      >
        <FullpageLoader text="Loading player..." />;
      </Layout>
    );
  }

  const onError = (evt: ErrorEvent) => {
    setErrorMessage('This video does not exist');
    setIsLoaded(false);
    console.error('Error', evt); // eslint-disable-line no-console
  };

  const showLoading = (!isLoaded && !errorMessage);

  const copyUrl = () => {
    copy(shareUrl, { message:  'Copy'});
    setIsCopied(true);
    /*
     * We need a ref to the setTimeout because if the user
     * navigates away before the timeout expires we will
     * clear it out
     */
    copyTimeoutRef.current = window.setTimeout(()=> {
      setIsCopied(false);
      copyTimeoutRef.current = null;
    }, 5000);
  };

  return (
    <Layout
      metaTitle={META_TITLE}
      image={"https://cloud-chv0h2jb1.vercel.app/0screenshot_2020-11-07_at_9.26.49_pm.png"}
      centered={showLoading}
      darkMode
    >
      {errorMessage && <h1 className="error-message">{errorMessage}</h1>}
      {showLoading && <FullpageLoader text="Loading player" />}
      <div className="wrapper">
        {!openReport && <VideoPlayer playbackId={playbackId} poster={poster} onLoaded={() => setIsLoaded(true)} onError={onError} />}
        <div className="actions" style={{ textAlign: 'center' }}>
          <div className="footer-link mux">The Oneness Play</div>
          <br />
          <a
              onClick={() => setOpenReport(!openReport)}
              onKeyPress={() => setOpenReport(!openReport)}
              role="button"
              tabIndex={0}
              style={{ textAlign: 'center', paddingTop: '10px'}}
              className="report">by Student Council
            </a>
        </div>
        <div className="report-form">
          { openReport && <ReportForm playbackId={playbackId} close={() => setOpenReport(false)} /> }
        </div>
      </div>
      <style jsx>{`
        .actions a:first-child {
          padding-right: 30px;
        }
        .error-message {
          color: #ccc;
        }
        .report-form {
          margin-top: 20px;
        }
        .wrapper {
          display: ${isLoaded ? 'flex' : 'none'};
          flex-direction: column;
          flex-grow: 1;
          align-items: center;
          justify-content: center;
        }
        .footer-link {
          font-size: 36px;
          line-height: 33px;
          mix-blend-mode: exclusion;
          color: #f8f8f8;
          opacity: 0.85;
          text-align: center;
        }
      `}
      </style>
    </Layout>
  );
};

export default Playback;
