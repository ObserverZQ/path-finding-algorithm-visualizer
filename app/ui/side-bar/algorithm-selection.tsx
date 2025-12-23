'use client';
import { useState } from 'react';
import { TextInput, Checkbox, Label } from 'flowbite-react';
import {
  Accordion,
  AccordionContent,
  AccordionPanel,
  AccordionTitle,
  Radio,
} from 'flowbite-react';
// import { Transition, Field, Radio, RadioGroup } from '@headlessui/react';
import {
  Algorithm,
  AlgorithmType,
  AlgorithmTypeKey,
  defaults,
  Heuristic,
  useSideBarStore,
} from '@/app/lib/sidebar';

const plans = ['Manhattan', 'Euclidean', 'Octile', 'Chebyshev'];

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
    setTimeout(() => {
      setAlgorithm(alg);
      console.log('Selected algorithm:', alg, algorithm.name);
    }, 50);
  };

  const handleOptionChange = (key: string, value: boolean) => {
    console.log('Option changed:', key, value);
    setAlgorithmOptions(algorithm.name, { [key]: value } as any);
  };

  const handleHeuristicChange = (h: React.FocusEvent<HTMLDivElement>) => {
    // setAlgorithmHeuristic(h);
    console.log('heuristic change test', (h.target as HTMLInputElement).value);
  };

  return (
    <div>
      <div className='text-lg font-[600] text-neutral-900'>
        Algorithm Selection
      </div>
      <div className='text-sm text-neutral-600'>
        Choose a path-finding algorithm and its setting.
      </div>
      <Accordion>
        {algorithms.map((alg) => (
          <AccordionPanel key={alg}>
            <AccordionTitle onFocus={() => handleAlgorithmChange(alg)}>
              {alg}
            </AccordionTitle>
            <AccordionContent>
              {/* Show heuristics only for A* */}
              {alg === AlgorithmType.AStar && (
                <div className='mb-2'>
                  <div className=' text-gray-500 dark:text-gray-400 font-medium'>
                    Heuristics
                  </div>
                  {heuristics.map((h) => (
                    <div className='flex items-center gap-2 mb-2' key={h}>
                      <Radio
                        id={`heuristic-${h}`}
                        name='heuristics'
                        value={h}
                        checked={algorithm.heuristic === h}
                        onChange={() => setAlgorithmHeuristic(h)}
                      />
                      <Label htmlFor={`heuristic-${h}`}>{h}</Label>
                    </div>
                  ))}
                </div>
              )}

              <div className='text-gray-500 dark:text-gray-400'>Options</div>
              {Object.keys(defaults[alg]).map((key) => (
                <div className='flex items-center gap-2' key={key}>
                  {key === 'weight' ? (
                    <TextInput
                      id={`opt-${key}`}
                      type='text'
                      sizing='sm'
                      value={(algorithm.options as any)[key] ?? 0}
                      onChange={(e) =>
                        handleOptionChange(
                          key,
                          parseFloat(e.target.value) as any
                        )
                      }
                      className='w-10 mt-0 py-1'
                    />
                  ) : (
                    <Checkbox
                      id={`opt-${key}`}
                      disabled
                      checked={Boolean((algorithm.options as any)[key])}
                      onChange={(e) =>
                        handleOptionChange(
                          key,
                          (e as React.ChangeEvent<HTMLInputElement>).target
                            .checked
                        )
                      }
                    />
                  )}
                  <Label htmlFor={`opt-${key}`}>{key}</Label>
                </div>
              ))}
            </AccordionContent>
          </AccordionPanel>
        ))}
      </Accordion>
    </div>
  );
}
