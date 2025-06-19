import { LogInCard } from "./components/LogInCard";

const LogInPage = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="w-full max-w-md px-4">
        <LogInCard />
      </div>
    </div>
  );
};

export default LogInPage;
// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { LogInCard } from "./components/LogInCard";

// const LogInPage = () => {
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const checkSession = async () => {
//       try {
//         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
//           credentials: "include",
//         });

//         if (res.ok) {
//           const user = await res.json();
//           if (user?.id) {
//             // ✅ Already logged in, redirect
//             router.replace("/feeds");
//             return;
//           }
//         }
//       } catch (err) {
//         console.error("Session check failed:", err);
//       }

//       setLoading(false); // ✅ User not logged in, show login form
//     };

//     checkSession();
//   }, [router]);

//   if (loading) return null; // or <Spinner />

//   return (
//     <div className="h-svh flex items-center justify-center mx-auto">
//       <LogInCard />
//     </div>
//   );
// };

// export default LogInPage;
