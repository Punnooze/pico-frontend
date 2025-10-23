import React from "react";

interface Props {}

function Categories(props: Props) {
  const {} = props;

  return (
    <div className="flex gap-4 min-w-max">
      <div className="w-[300px] bg-secondary-accent p-4 rounded-md">
        Column 1
      </div>
      <div className="w-[300px] bg-secondary-accent p-4 rounded-md">
        Column 2
      </div>
      <div className="w-[300px] bg-secondary-accent p-4 rounded-md">
        Column 3
      </div>
      <div className="w-[300px] bg-secondary-accent p-4 rounded-md">
        Column 4
      </div>
    </div>
  );
}

export default Categories;
