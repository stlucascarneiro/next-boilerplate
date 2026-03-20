import Image from "next/image";

import logo from "@/public/images/logo.png";

interface IProps {
  className?: string;
}

const Logo = ({}: IProps) => {
  return (
    <div>
      <Image
        alt="Next.js Logo"
        className="w-10"
        height={106}
        src={logo}
        width={144}
      />
    </div>
  );
};

export default Logo;
