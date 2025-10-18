import React, { Dispatch, SetStateAction } from "react";
import UserInfoCard from "./UserInfoCard";
import UserMediaCart from "./UserMediaCart";
import { User } from "@/type";

type Props = {
  setIsEdit: Dispatch<SetStateAction<boolean>>;
  userProfile?: User;
  id?: string;
  idFollowing: boolean;
};

const RightSidebar = ({ setIsEdit, userProfile, id, idFollowing }: Props) => {
  return <div>{/* <UserMediaCart /> */}</div>;
};

export default RightSidebar;
