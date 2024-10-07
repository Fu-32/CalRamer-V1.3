// src/models/Reservations.ts

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseKey = 'your-supabase-key';
const supabase = createClient(supabaseUrl, supabaseKey);

export interface IReservations {
  id?: number;
  startDate: Date;
  endDate: Date;
  userId?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const getReservations = async (): Promise<IReservations[]> => {
  const { data, error } = await supabase
    .from('reservations')
    .select('*');

  if (error) {
    throw new Error(error.message);
  }

  return data as IReservations[];
};

export const createReservations = async (reservations: IReservations): Promise<IReservations> => {
  const { data, error } = await supabase
    .from('reservations')
    .insert([reservations]);

  if (error) {
    throw new Error(error.message);
  }

  if (!data || (data as IReservations[]).length === 0) {
    throw new Error('No data returned');
  }
  return (data as IReservations[])[0];
};

export const updateReservations = async (id: number, reservations: Partial<IReservations>): Promise<IReservations> => {
  const { data, error } = await supabase
    .from('reservations')
    .update(reservations)
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  if (!data || (data as IReservations[]).length === 0) {
    throw new Error('No data returned');
  }
  return (data as IReservations[])[0];
};

export const deleteReservations = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('reservations')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
};

const Reservations = {
  getReservations,
  createReservations,
  updateReservations,
  deleteReservations,
};

export default Reservations;