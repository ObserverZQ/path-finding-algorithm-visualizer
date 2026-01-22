'use client';
import { useState, createElement } from 'react';
import {
  TextInput,
  Checkbox,
  Label,
  Button,
  Drawer,
  DrawerHeader,
  DrawerItems,
  Accordion,
  AccordionContent,
  AccordionPanel,
  AccordionTitle,
  Radio,
} from 'flowbite-react';
import { VscBook } from 'react-icons/vsc';
// import { Transition, Field, Radio, RadioGroup } from '@headlessui/react';
import {
  Algorithm,
  AlgorithmType,
  AlgorithmTypeKey,
  defaults,
  Heuristic,
  defaultHeuristic,
  useSideBarStore,
} from '@/app/lib/sidebar';
import MD_BFS from '@/app/docs/Breadth-First-Search.md';
import MD_DFS from '@/app/docs/Depth-First-Search.md';
import MD_Greedy from '@/app/docs/Greedy-Best-First-Search.md';
import MD_AStar from '@/app/docs/A-Star-Search.md';

const plans = ['Manhattan', 'Euclidean', 'Octile', 'Chebyshev'];

const mdMap = {
  [AlgorithmType.BFS]: MD_BFS,
  [AlgorithmType.DFS]: MD_DFS,
  [AlgorithmType.GreedyBestFirst]: MD_Greedy,
  [AlgorithmType.AStar]: MD_AStar
};

export default function AlgorithmSelection() {
  // const [open, setOpen] = useState(false);
  // const [enabled, setEnabled] = useState(false);
  // const [selected, setSelected] = useState(plans[0]);
  const {
    algorithm,
    setAlgorithm,
    setAlgorithmOptions,
    setAlgorithmHeuristic,
  } = useSideBarStore();

  const algorithms = Object.values(AlgorithmType);
  const heuristics = Object.values(Heuristic);
  const handleAlgorithmChange = (alg: AlgorithmTypeKey) => {
    setAlgorithm(alg);
    console.log('Selected algorithm:', alg);
  };
  const onClickLearn = () => {
    setIsOpen(true);
  };
  const handleOptionChange = (
    alg: AlgorithmTypeKey,
    key: string,
    value: any
  ) => {
    console.log('Option changed:', alg, key, value);
    setAlgorithmOptions(alg, { [key]: value } as any);
  };

  const handleHeuristicChange = (alg: AlgorithmTypeKey, h: Heuristic) => {
    // ensure algorithm is selected then set heuristic
    setAlgorithm(alg);
    setAlgorithmHeuristic(h);
  };
  const needsHeuristic = (alg: AlgorithmTypeKey) =>
    alg === AlgorithmType.AStar || alg === AlgorithmType.GreedyBestFirst;

  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);
  return (
    <div>
      <div className='text-lg font-[600] text-neutral-900'>
        II. Algorithm Selection
      </div>
      <div className='text-sm text-neutral-600 mb-2'>
        Choose a path-finding algorithm and its setting.
      </div>
      <Accordion>
        {algorithms.map((alg) => (
          <AccordionPanel key={alg}>
            <AccordionTitle
              className='p-3 text-sm'
              onFocus={() => handleAlgorithmChange(alg)}
            >
              {alg}
            </AccordionTitle>
            <AccordionContent>
              {/* Show heuristics only for A* */}
              {needsHeuristic(alg) && (
                <div className='mb-2'>
                  <div className='text-sm text-neutral-900 dark:text-gray-400'>
                    Heuristics
                  </div>
                  {heuristics.map((h) => {
                    const currentHeuristic =
                      alg === algorithm.name
                        ? algorithm.heuristic ?? defaultHeuristic
                        : defaultHeuristic;
                    return (
                      <div className='flex items-center gap-2 mb-2' key={h}>
                        <Radio
                          id={`heuristic-${h}`}
                          name={`heuristics-${alg}`}
                          value={h}
                          checked={currentHeuristic === h}
                          onChange={() => handleHeuristicChange(alg, h)}
                        />
                        <Label htmlFor={`heuristic-${h}`}>{h}</Label>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className='text-sm text-neutral-900 dark:text-gray-400'>
                Options
              </div>
              {Object.keys(defaults[alg]).map((key) => {
                const defaultVal = (defaults as any)[alg][key];
                const optionValue =
                  alg === algorithm.name
                    ? (algorithm.options as any)[key] ?? defaultVal
                    : defaultVal;
                return (
                  <div className='flex items-center gap-2' key={key}>
                    {key === 'weight' ? (
                      <TextInput
                        id={`opt-${key}`}
                        type='text'
                        sizing='sm'
                        value={optionValue ?? 0}
                        onChange={(e) =>
                          handleOptionChange(
                            alg,
                            key,
                            parseFloat(e.target.value) as any
                          )
                        }
                        className='w-10 mt-0 py-1'
                      />
                    ) : (
                      <Checkbox
                        id={`opt-${key}`}
                        checked={Boolean(optionValue)}
                        onChange={(e) =>
                          handleOptionChange(
                            alg,
                            key,
                            (e as React.ChangeEvent<HTMLInputElement>).target
                              .checked
                          )
                        }
                      />
                    )}
                    <Label htmlFor={`opt-${key}`}>{key}</Label>
                  </div>
                );
              })}
              <div className='flex justify-center'>
                <Button
                  outline
                  pill
                  size='sm'
                  className='mt-2 text-primary-500 border-primary-500'
                  onClick={onClickLearn}
                >
                  Learn About {algorithm.name}
                </Button>
              </div>

            </AccordionContent>
          </AccordionPanel>
        ))}
      </Accordion>
      <Drawer open={isOpen} onClose={handleClose} position='right'>
        <DrawerHeader title={algorithm.name} titleIcon={VscBook} />
        <DrawerItems>
          {createElement(mdMap[algorithm.name as AlgorithmTypeKey])}
          {/* <p className='mb-6 text-sm text-gray-500 dark:text-gray-400'>
            Supercharge your hiring by taking advantage of our&nbsp;
            <a
              href='#'
              className='text-cyan-600 underline hover:no-underline dark:text-cyan-500'
            >
              limited-time sale
            </a>
            &nbsp;for Flowbite Docs + Job Board. Unlimited access to over 190K
            top-ranked candidates and the #1 design job board.
          </p> */}
          {/* <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <a
              href='#'
              className='rounded-lg border border-gray-200 bg-white px-4 py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-cyan-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700'
            >
              Learn more
            </a>
            <a
              href='#'
              className='inline-flex items-center rounded-lg bg-cyan-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800'
            >
              Get access&nbsp;
              <svg
                className='ms-2 h-3.5 w-3.5 rtl:rotate-180'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 14 10'
              >
                <path
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M1 5h12m0 0L9 1m4 4L9 9'
                />
              </svg>
            </a>
          </div> */}
        </DrawerItems>
      </Drawer>
    </div>
  );
}
