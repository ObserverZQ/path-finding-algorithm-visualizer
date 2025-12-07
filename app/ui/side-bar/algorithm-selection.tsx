'use client';
import { useState } from 'react';
import { TextInput, Checkbox, Label } from "flowbite-react";
import { Accordion, AccordionContent, AccordionPanel, AccordionTitle, Radio } from "flowbite-react";
// import { Transition, Field, Radio, RadioGroup } from '@headlessui/react';
import { Algorithm, AlgorithmType, AlgorithmTypeKey, Heuristic, useSideBarStore } from '@/app/lib/sidebar';

const plans = ['Manhattan', 'Euclidean', 'Octile', 'Chebyshev'];

export default function AlgorithmSelection() {
    const [open, setOpen] = useState(false);
    const [enabled, setEnabled] = useState(false);
    let [selected, setSelected] = useState(plans[0]);
    const { algorithm, setAlgorithm, setAlgorithmOptions, setAlgorithmHeuristic } = useSideBarStore();

    const algorithms = Object.values(AlgorithmType);
    const heuristics = Object.values(Heuristic);
    const testToggle = (item) => {
        console.log('Toggled!', item);
    };
    const handleAlgorithmChange = (alg: AlgorithmTypeKey) => {
        setAlgorithm(alg);
        console.log('Selected algorithm:', alg, algorithm.name);
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
            <div className="text-lg font-[600] text-neutral-900">Algorithm Selection</div>
            <div className="text-sm text-neutral-600">Choose a path-finding algorithm and its setting.</div>
            {
                // algorithms.map((alg) => (
                //     <div key={alg}>
                //         <Button onClick={() => handleAlgorithmChange(alg)}>{alg}</Button>
                //         {alg === algorithm.name && <div>
                //             <div className="transition duration-100 ease-in data-closed:opacity-0
                //     bg-white rounded-s-md p-2 mt-1 border-neutral-300 border">
                //                 {/* <div>Heuristics</div>
                //         <RadioGroup value={selected} onChange={setSelected} aria-label="Server size">
                //             {plans.map((plan) => (
                //                 <Field key={plan} className="flex items-center gap-2">
                //                     <Radio
                //                         value={plan}
                //                         className="group flex size-5 items-center justify-center rounded-full border bg-white data-checked:bg-primary-500"
                //                     >
                //                         <span className="invisible size-2 rounded-full bg-white group-data-checked:visible" />
                //                     </Radio>
                //                     <Label>{plan}</Label>
                //                 </Field>
                //             ))}
                //         </RadioGroup> */}
                //                 <div>Options</div>
                //                 {algorithm.name}
                //                 {Object.keys(algorithm.options).map((key) => (
                //                     <div className="flex items-center gap-2" key={key}>
                //                         <Checkbox
                //                             id={`opt-${key}`}
                //                             checked={Boolean((algorithm.options as any)[key])}
                //                             onChange={(e) => handleOptionChange(key, (e as React.ChangeEvent<HTMLInputElement>).target.checked)}
                //                         />
                //                         <Label htmlFor={`opt-${key}`}>{key}</Label>
                //                     </div>
                //                 ))}
                //             </div>
                //         </div>}
                //     </div >
                // ))
            }
            <Accordion>
                {algorithms.map((alg) => (
                    <AccordionPanel key={alg}>
                        <AccordionTitle onFocus={() => handleAlgorithmChange(alg)}>
                            {alg}
                        </AccordionTitle>
                        <AccordionContent>
                            {/* Show heuristics only for A* */}
                            {alg === AlgorithmType.AStar && (
                                <div className="mb-2">
                                    <div className=" text-gray-500 dark:text-gray-400 font-medium">Heuristics</div>
                                    {heuristics.map((h) => (
                                        <div className="flex items-center gap-2 mb-2" key={h}>
                                            <Radio
                                                id={`heuristic-${h}`}
                                                name="heuristics"
                                                value={h}
                                                checked={algorithm.heuristic === h}
                                                onChange={() => setAlgorithmHeuristic(h)}
                                            />
                                            <Label htmlFor={`heuristic-${h}`}>{h}</Label>
                                        </div>
                                    ))}
                                </div>
                            )}


                            <div className="text-gray-500 dark:text-gray-400">Options</div>
                            {Object.keys(algorithm.options).map((key) => (
                                <div className="flex items-center gap-2" key={key}>
                                    {key === 'weight' ? (
                                        <TextInput
                                            id={`opt-${key}`}
                                            type="number"
                                            value={(algorithm.options as any)[key]}
                                            onChange={(e) => handleOptionChange(key, parseFloat(e.target.value) as any)}
                                            className="w-16 px-2 py-1 border border-gray-300 rounded"
                                        />
                                    ) : (
                                        <Checkbox
                                            id={`opt-${key}`}
                                            checked={Boolean((algorithm.options as any)[key])}
                                            onChange={(e) => handleOptionChange(key, (e as React.ChangeEvent<HTMLInputElement>).target.checked)}
                                        />
                                    )}
                                    <Label htmlFor={`opt-${key}`}>{key}</Label>
                                </div>
                            ))}
                        </AccordionContent>
                    </AccordionPanel>
                ))}
            </Accordion>

        </div >
    );
}