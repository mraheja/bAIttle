export interface UserProps {
  name: string;
}

export const User: React.FC<UserProps> = ({ name }) => {
  return (
    <div className=" ml-3 h-8 w-8 bg-red-600 flex justify-center align-middle rounded-full items-center hover:bg-red-800 cursor-pointer border-[2px] border-solid border-white">
        <span className="text-white">{ name[0].toUpperCase() }</span>
    </div>
  );
};
