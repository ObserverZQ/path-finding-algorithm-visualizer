export type AnimationStep = {
    type: 'explore' | 'frontier' | 'path',
    gridId: string;
    timestamp: number;
};