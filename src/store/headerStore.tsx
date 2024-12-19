import * as React from 'react';
import { create } from 'zustand';

export type HeaderStoreState = {
    content?: React.ReactNode;
    banner?: string;
    compact: boolean;
}

export type HeaderStoreActions = {
    setContent: (content: React.ReactNode) => void;
    setBanner: (banner: string) => void;
    setCompact: (compact: boolean) => void;
}

const useHeaderStore = create<HeaderStoreState & HeaderStoreActions>((set) => ({
    content: undefined,
    banner: undefined,
    compact: false,

    setContent: (content) => set({content}),
    setBanner: (banner) => set({banner}),
    setCompact: (compact) => set({compact}),
}));

export default useHeaderStore;