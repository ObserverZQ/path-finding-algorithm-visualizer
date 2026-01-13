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
  defaultHeuristic,
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
    setAlgorithm(alg);
    console.log('Selected algorithm:', alg);
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
            </AccordionContent>
          </AccordionPanel>
        ))}
      </Accordion>
    </div>
  );
}
