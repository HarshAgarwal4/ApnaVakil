import { create } from "zustand"
import axios from "../services/axios"
import { toast } from "react-toastify"

export const useStore = create((set, get) => ({
  /* ===================== STATE ===================== */
  user: null,
  loading: true,
  chat: [],
  history: [],                      // -----> all chats history
  activeChat: null,                 // -----> active chats from history
  article: null,
  lawyer: [],
  All_Histories: {
    all_h: [],
    isloading: true
  },
  plan: null,
  isPaid: false,
  showPricingBox: false,
  print: null,
  showPrintPage: false,
  sidebarOpen: true,
  DraftChatHistory: [],             // ----> Draft chat history
  DraftMode: false,
  activeDraft: null,                 // ------> Active Drafts
  YourDrafts: {                       // -----> all drafts of user
    isloading: true,
    drafts: []
  },
  document: null,

  /* ===================== SETTERS ===================== */
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setChat: (chat) => set({ chat }),
  setHistory: (history) => set({ history }),
  setActiveChat: (activeChat) => {
    set({ activeChat })
    if (activeChat) {
      set({ history: activeChat.messages })
    }
  },
  setArticle: (article) => set({ article }),
  setLawyer: (lawyer) => set({ lawyer }),
  setPlan: (plan) => set({ plan }),
  setIsPaid: (isPaid) => set({ isPaid }),
  setShowPricingBox: (showPricingBox) => set({ showPricingBox }),
  setPrint: (print) => set({ print }),
  setShowPrintPage: (showPrintPage) => set({ showPrintPage }),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  setDraft: (DraftMode) => set({ DraftMode }),
  setDraftChatHistory: (DraftChatHistory) => set({ DraftChatHistory }),
  setActiveDraft: (activeDraft) => {
    set({ activeDraft })
    if (activeDraft) {
      set({ DraftChatHistory: activeDraft.messages })
      set({ document: activeDraft.document })
    }
  },
  setDocument: (document) => set({ document }),
  setMode: (mode) => set({ mode }),
  activeBlock: null,                // which block is opened
    setActiveBlock: (index) => set({ activeBlock: index }),

    clearActiveBlock: () => set({
        activeBlock: null,
        editMessage: ""
    }),

    editMessage: "",                  // instruction user types
    setEditMessage: (msg) => set({ editMessage: msg }),

  /* ===================== ACTIONS ===================== */
  fetchUser: async () => {
    try {
      const res = await axios.get("/me")

      if (res.status === 200) {
        if (res.data.status === 0) return toast.error("something went wrong")
        if (res.data.status === 2) return toast.error("Invalid User")
        if (res.data.status === 8) return toast.error("unauthorized access")
        if (res.data.status === 10) return toast.error("user not found")

        if (res.data.status === 1) {
          toast.success("User fetched succesfully")
          set({ user: res.data.data })
        }
      }
    } catch (err) {
      toast.error("server error")
    } finally {
      set({ loading: false })
    }
  },

  fetchHistory: async () => {
    set((state) => ({
      All_Histories: { ...state.All_Histories, isloading: true }
    }))
    try {
      let res = await axios.get('/fetchHistory');
      if (res.status === 200 && res.data.status === 1) {
        const historyData = res.data.data;
        set((state) => ({
          All_Histories: { ...state.All_Histories, all_h: historyData }
        }))
      }
    } catch (err) {
      console.log(err);
      toast.error('Error in fetching history');
    } finally {
      set((state) => ({
        All_Histories: { ...state.All_Histories, isloading: true }
      }))
    }
  },

  fetchDrafts: async () => {
    set((state) => ({
      YourDrafts: { ...state.YourDrafts, isloading: true }
    }))
    try {
      let res = await axios.post('/fetchDrafts');
      if (res.status === 200 && res.data.status === 1) {
        const historyData = res.data.drafts;
        set((state) => ({
          YourDrafts: { ...state.YourDrafts, drafts: historyData }
        }))
      }
    } catch (err) {
      console.log(err);
      toast.error('Error in fetching Drafts');
    } finally {
      set((state) => ({
        YourDrafts: { ...state.YourDrafts, isloading: true }
      }))
    }
  },

  checkPlan: () => {
    const user = get().user
    if (!user) return false

    const paidPlans = ["Basic", "Premium"]

    if (user.role === "admin") return true

    if (paidPlans.includes(user.plan)) {
      set({
        plan: user.plan,
        isPaid: true,
      })
      return true
    }

    return false
  },

  initApp: () => {
    const isMobile = window.innerWidth < 640
    set({ sidebarOpen: !isMobile })
    get().fetchUser()
  },
}))
