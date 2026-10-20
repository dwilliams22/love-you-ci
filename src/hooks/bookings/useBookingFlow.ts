// React binding of the booking-flow store (wix/bookings/booking-flow-store.ts) — the whole booking
// state machine for one service lives there, framework-free: the display zone, the availability
// window (day-grouped slots, week paging, staff filter, next availability), a course's seats, a
// class's sessions, participants, deposit choice, add-ons, the schema-driven form, the CTA state,
// and book(). All correctness lives in the data layer; you own how it looks. Mount the surface
// client-only: availability is timezone/session-specific.
import { useEffect, useState, useSyncExternalStore } from "react";
import { createBookingFlowStore, type BookingFlowOptions, type BookingFlowState, type BookingFlowStore } from "../../wix/bookings/booking-flow-store";
import type { ServiceDetail } from "../../wix/bookings/types";

export type UseBookingFlow = BookingFlowState &
  Pick<
    BookingFlowStore,
    | "nextWeek"
    | "prevWeek"
    | "nextMonth"
    | "prevMonth"
    | "jumpTo"
    | "setStaffId"
    | "setSelectedSlot"
    | "setDisplayTimeZone"
    | "setParticipants"
    | "setPayDeposit"
    | "toggleAddOn"
    | "setAddOnIds"
    | "setAddOnQuantity"
    | "canSelectMore"
    | "loadMoreSessions"
    | "setValue"
    | "book"
  >;

export function useBookingFlow(service: ServiceDetail, options?: BookingFlowOptions): UseBookingFlow {
  // Love You, Ci: lazy state instead of a ref read during render (React Compiler rule).
  // One store per mount — remount with key={service.id} to switch services.
  const [store] = useState(() => createBookingFlowStore(service, options));
  useEffect(() => {
    store.start();
    return () => store.stop();
  }, [store]);
  const state = useSyncExternalStore(store.subscribe, store.getState, store.getState);
  return {
    ...state,
    nextWeek: store.nextWeek,
    prevWeek: store.prevWeek,
    nextMonth: store.nextMonth,
    prevMonth: store.prevMonth,
    jumpTo: store.jumpTo,
    setStaffId: store.setStaffId,
    setSelectedSlot: store.setSelectedSlot,
    setDisplayTimeZone: store.setDisplayTimeZone,
    setParticipants: store.setParticipants,
    setPayDeposit: store.setPayDeposit,
    toggleAddOn: store.toggleAddOn,
    setAddOnIds: store.setAddOnIds,
    setAddOnQuantity: store.setAddOnQuantity,
    canSelectMore: store.canSelectMore,
    loadMoreSessions: store.loadMoreSessions,
    setValue: store.setValue,
    book: store.book,
  };
}
