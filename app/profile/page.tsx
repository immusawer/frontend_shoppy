"use client"

import React, { useEffect, useState } from "react";
import { Toaster } from "sonner";
import ProfileDialog from "../components/profile-dialog";

export default function ProfilePage() {
  const [open, setOpen] = useState(true);

  const onOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  return (
    <>
      <ProfileDialog open={open} onOpenChange={onOpenChange} />
      <Toaster />
    </>
  );
}