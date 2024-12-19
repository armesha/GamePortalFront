import { create } from 'zustand';

interface StoreState {
    isChatOpen: boolean;
    /** 'all' means the main chat dialog, number means the dialog with the user */
    dialog: 'all' | number;
}

interface StoreActions {
    toggleChat: () => void;
    closeChat: () => void;
    openChat: () => void;
    setDialog: (dialog: 'all' | number) => void;
}

const useChatStore = create<StoreState & StoreActions>((set) => ({
    isChatOpen: false,
    toggleChat: () => set((state) => ({isChatOpen: !state.isChatOpen})),
    closeChat: () => set({isChatOpen: false}),
    openChat: () => set({isChatOpen: true}),

    dialog: 'all',
    setDialog: (dialog) => set({dialog}),
}));

export default useChatStore;