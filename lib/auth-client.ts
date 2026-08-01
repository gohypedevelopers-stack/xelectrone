export const authClient = {
  useSession: () => ({
    data: {
      user: {
        name: "XElectron Admin",
        email: "admin@xelectron.com",
        image: "",
      },
    },
    isPending: false,
    error: null,
  }),
  signOut: async () => {
    return { success: true };
  },
};
