import Image from "next/image";
import logo from "@/app/favicon.png";

const Header = () => {
  return (
    <header className="flex flex-col items-center shadow-md w-full pb-4">
      <Image src={logo} alt="Turkish at Yale logo" className="size-30" />
      <div className="flex gap-2 items-baseline">
        <h1 className="text-2xl font-semibold yalebluetext">
          AI Turkish Tutor:{" "}
        </h1>
        <h2 className="text-2xl">Script generator</h2>
      </div>
    </header>
  );
};

export default Header;
