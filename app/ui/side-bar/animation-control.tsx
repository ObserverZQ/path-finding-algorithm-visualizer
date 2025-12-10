'use client';
import { Button } from 'flowbite-react';
import { SearchStatus, useSideBarStore } from '@/app/lib/sidebar';
import { VscPlay, VscDebugContinue, VscClearAll, VscRemove } from "react-icons/vsc";

export default function AnimationControl() {
    const { status, setStatus } = useSideBarStore();
    const changeSearchStatus = () => {
        setStatus(status === SearchStatus.Idle ? SearchStatus.Running : SearchStatus.Idle);
    };
    return (
        <div>
            Animation Control
            <div className="mt-4 flex gap-2">
                <Button as="span" className='w-[50%]' onClick={changeSearchStatus}>
                    <VscPlay className="w-5 h-5 mr-2" />
                    {
                        status === SearchStatus.Idle ? 'Run' : 'Cancel'
                    }</Button>
                <Button as="span" className='w-[50%]' color="green">
                    <VscDebugContinue className="w-5 h-5 mr-2" />
                    Manual Step
                </Button>
            </div>
            <div className="mt-4 flex gap-2">
                <Button as="span" className='w-[50%]' color="alternative">
                    <VscClearAll className="w-5 h-5 mr-2" />
                    Clear All
                </Button>
                <Button as="span" className='w-[50%]' color="alternative">
                    <VscRemove className="w-5 h-5 mr-2" />
                    Clear Path
                </Button>
            </div>
        </div>
    );
}