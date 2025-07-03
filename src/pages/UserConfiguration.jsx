import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { mockRecipes } from "./mockRecipes";
import { Radio, Typography } from "@material-tailwind/react";

export default function UserConfiguration(){
    return(
        <><h1>Config user</h1></>
    )
}