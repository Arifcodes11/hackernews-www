import { PropsWithChildren } from "react";

const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
};

export default AuthLayout; 