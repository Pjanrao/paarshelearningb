"use client";

import { Provider } from "react-redux";
import { store, persistor } from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}



// "use client";

// import { Provider, useDispatch } from "react-redux";
// import { store } from "@/redux/store";
// import { useEffect, useState } from "react";
// import Cookies from "js-cookie";
// import { setAuth } from "@/redux/authSlice";

// function AuthHydrate({ children }: { children: React.ReactNode }) {
//   const dispatch = useDispatch();
//   const [isHydrated, setIsHydrated] = useState(false);

//   useEffect(() => {
//     const token = Cookies.get("token") || localStorage.getItem("token");
//     const role = Cookies.get("role") || localStorage.getItem("role") as any;
//     const userStr = localStorage.getItem("user");
//     let user = null;

//     try {
//       if (userStr) user = JSON.parse(userStr);
//     } catch (e) {
//       console.error("Failed to parse user from localStorage", e);
//     }

//     if (token && role) {
//       dispatch(setAuth({ token, role, user }));
//     }
//     setIsHydrated(true);
//   }, [dispatch]);

//   if (!isHydrated) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2C4276]"></div>
//       </div>
//     );
//   }

//   return <>{children}</>;
// }

// export default function ReduxProvider({ children }: { children: React.ReactNode }) {
//   return (
//     <Provider store={store}>
//       <AuthHydrate>{children}</AuthHydrate>
//     </Provider>
//   );
// }