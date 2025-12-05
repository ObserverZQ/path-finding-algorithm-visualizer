'use client';
import { useState } from 'react';
import { Button, Checkbox, Label } from "flowbite-react";
import { Accordion, AccordionContent, AccordionPanel, AccordionTitle } from "flowbite-react";
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
        setAlgorithmOptions(algorithm.name, { [key]: value } as any);
    };

    const handleHeuristicChange = (h: Heuristic) => {
        setAlgorithmHeuristic(h);
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
                            <div className="mb-2 text-gray-500 dark:text-gray-400">Options</div>
                            {Object.keys(algorithm.options).map((key) => (
                                <div className="flex items-center gap-2" key={key}>
                                    <Checkbox
                                        id={`opt-${key}`}
                                        checked={Boolean((algorithm.options as any)[key])}
                                        onChange={(e) => handleOptionChange(key, (e as React.ChangeEvent<HTMLInputElement>).target.checked)}
                                    />
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