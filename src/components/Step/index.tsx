import ReactDOM from 'react-dom';
import { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import Modal from 'react-modal';
import useEventListener from '@use-it/event-listener';

import InteractiveArea from 'src/components/InteractiveArea';
import HighlightedText from 'src/components/HighlightedText';
import Progress from 'src/components/Progress';
import Button from 'src/components/Button';
import { Lesson, LessonData } from 'src/types';

import styles from './Step.module.css';

interface Props {
  lesson: Lesson;
  step: number;
  steps: object[];
  error: boolean;
  onChangeSuccess: Function;
  data: LessonData;
}

const Step = ({ lesson, data, step, steps, error: parentError, onChangeSuccess }: Props) => {
  const [mounted, setMounted] = useState(false);
  const [modalIsOpen, setIsOpenModal] = useState(false);
  const { formatMessage } = useIntl();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCloseModal = event => {
    if (event.key === 'Escape') {
      setIsOpenModal(false);
    }
  };

  useEventListener('keyup', handleCloseModal);

  const isInteractive = data.interactive !== false;

  return (
    <div className={styles.Step}>
      {data.image && <img className={styles.StepImage} src={data.image} alt="" width="100px" />}
      {data.originalTitle && <h4 className={styles.StepTitleOriginal}>{data.originalTitle}</h4>}
      <HighlightedText
        element="h2"
        className={styles.StepTitle}
        text={formatMessage({ id: data.title })}
        attrs={{ className: styles.StepTitleWord }}
      />
      <HighlightedText
        element="p"
        className={styles.StepDescription}
        text={formatMessage({ id: data.description })}
        attrs={{ className: styles.StepDescriptionWord }}
      />

      <InteractiveArea
        lesson={lesson}
        isShow={isInteractive}
        data={data}
        step={step}
        parentError={parentError}
        onChangeSuccess={onChangeSuccess}
        setIsOpenModal={setIsOpenModal}
      />
      {lesson.sponsor && (
        <span className={styles.LessonSponsor}>
          Sponsored by{' '}
          <a href={lesson.sponsorURL} target="_blank" rel="noreferrer">
            <img src={lesson.sponsorLogo} alt={lesson.sponsor} />
          </a>
        </span>
      )}
      {data.videoURL && (
        <Modal
          isOpen={modalIsOpen}
          style={{
            overlay: {
              background: 'rgba(0, 0, 0, 0.7)',
            },
            content: {
              background: 'transparent',
              border: 'none',
              textAlign: 'right',
            },
          }}
        >
          <Button onClick={() => setIsOpenModal(false)}>Close</Button>
          <iframe
            width="100%"
            height="90%"
            src={data.videoURL}
            frameBorder={0}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </Modal>
      )}
      {mounted &&
        ReactDOM.createPortal(
          <Progress total={steps.length} current={step + 1} />,
          window.document.getElementById('ProgressArea'),
        )}
    </div>
  );
};

export default Step;
