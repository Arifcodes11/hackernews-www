// import { SignUpCard } from "./components/sign-up-card/SignUpCard";

// const SignUpPage = () => {
//   return (
//     <div className="min-h-screen w-full flex items-center justify-center bg-background">
//       <div className="w-full max-w-md px-4">
//         <SignUpCard />
//       </div>
//     </div>
//   );
// };

// export default SignUpPage;
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SignUpCard } from "./components/sign-up-card/SignUpCard";

const SignUpPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
          credentials: "include",
        });

        if (res.ok) {
          const user = await res.json();
          if (user?.id) {
            // ✅ Already logged in
            router.replace("/feeds");
            return;
          }
        }
      } catch (err) {
        console.error("Session check failed:", err);
      }

      setLoading(false); // ✅ User not logged in, show signup
    };

    checkSession();
  }, [router]);

  if (loading) return null;

  return (
    <div className="h-svh flex items-center justify-center mx-auto">
      <SignUpCard />
    </div>
  );
};

export default SignUpPage;
