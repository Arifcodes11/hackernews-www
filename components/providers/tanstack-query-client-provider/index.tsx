"use client";


import {  tanstackQueryClient } from '@/lib/integrations/tanstack-query';
import { QueryClientProvider } from '@tanstack/react-query';
import React, { PropsWithChildren } from 'react'

export const TanstackQueryClientProvider = ({ children }: PropsWithChildren) => {
    return (
      <QueryClientProvider client={tanstackQueryClient}>
        {children}
      </QueryClientProvider>
    );

}