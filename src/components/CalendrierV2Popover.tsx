// src/components/CalendrierV2Popover.tsx
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "@radix-ui/react-icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"; // Assurez-vous que ces composants existent
import CalendrierV2 from "./CalendrierV2"; // Importez votre CalendrierV2

export function CalendrierV2Popover() {
    return (
        <div className="max-w-md mx-auto">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full flex justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        Choisissez une date
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <CalendrierV2 />
                </PopoverContent>
            </Popover>
        </div>
    );
}