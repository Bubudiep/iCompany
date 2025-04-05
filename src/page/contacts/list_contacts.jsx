import React, { useEffect } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { useUser } from "../../components/context/userContext";

const Contacts_list = () => {
  const { activeFilter } = useOutletContext();
  const { user } = useUser();
  useEffect(() => {
    console.log(user, activeFilter);
  }, [activeFilter]);
  return (
    <div className="flex flex-1 overflow-hidden flex-col">
      <div key={activeFilter.id} className="whiteTitle fadeInBot">
        <div className="flex items-center gap-2">
          {activeFilter.icon}
          {activeFilter.label}
        </div>
      </div>
    </div>
  );
};

export default Contacts_list;
