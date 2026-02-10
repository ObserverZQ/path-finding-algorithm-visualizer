'use client';
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'flowbite-react';
import { useState, useEffect } from 'react';

export default function Header() {
  const [openModal, setOpenModal] = useState(false);
  useEffect(() => {
    try {
      const key = 'introShown';
      if (typeof window !== 'undefined') {
        const shown = localStorage.getItem(key);
        if (shown !== 'true') {
          setOpenModal(true);
          localStorage.setItem(key, 'true');
        }
      }
    } catch (e) {
      // ignore localStorage errors
    }
  }, []);
  return (
    <>
      <div className='w-full h-15 bg-white border-b-1 border-b-neutral-300 shadow-xs flex items-center justify-center'>
        <div className='w-[1440px] h-full flex items-center justify-between'>
          <img className='h-full' src='/logo.png' alt='' />
          {/* buttons */}
          <div className='flex items-center gap-7 text-sm text-neutral-900'>
            <div
              className='flex items-center cursor-pointer'
              onClick={() => setOpenModal(true)}
            >
              <img className='w-6 mr-1' src='/image-text.png' alt='' />
              <div>Intro</div>
            </div>
            <a
              className='flex items-center cursor-pointer'
              target='_blank'
              href='https://github.com/ObserverZQ/path-finding-algorithm-visualizer'
            >
              <img className='w-6 mr-1' src='/book.png' alt='' />
              <div>Blog</div>
            </a>
            <a
              className='flex items-center cursor-pointer'
              target='_blank'
              href='https://github.com/ObserverZQ/path-finding-algorithm-visualizer'
            >
              <img className='w-6 mr-1' src='/github.png' alt='' />
              <div>GitHub</div>
            </a>
          </div>
        </div>
      </div>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <ModalHeader className='text-center'>Intro</ModalHeader>
        <ModalBody>
          <div className='space-y-6 text-base leading-relaxed text-gray-800 dark:text-gray-400'>
            <div>
              {' '}
              Welcome to Kerry&apos;s Path-Finding Algorithm Visualizer! Here
              are the three simple steps to explore divergent path-finding
              algorithms:
            </div>

            <div>
              1.Set up the Maze
              <p>
                i. Click and drag along blank cells or walls(⬜️) to toggle them
                between empty and wall spaces.
              </p>
              <p>
                ii.Drag the starting point(🏹) and the destination(🎯) to change
                their positions.
              </p>
            </div>
            <div>
              2. Select an Algorithm and Configure Options
              {/* <p>
                P.S. Feel free to click Learn about [Algorithm] to get a
                detailed explanation for the selected algorithm.
              </p>
              <p>
                P.P.S. Still curious? Click Blog to see my own experiments and
                conclusions under different conditions.
              </p> */}
            </div>
            <div>
              3. Run the Search(Continuously or Step-by-Step)
              <p>
                i. Run executes the algorithm continuously, displaying the
                process without pause.
              </p>
              <p>
                ii. Manual Step supports executing one step at a time and shows
                more detailed log output.
              </p>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            className='bg-primary-500'
            onClick={() => setOpenModal(false)}
          >
            Got it!
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
