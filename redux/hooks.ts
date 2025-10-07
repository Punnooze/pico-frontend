/**
 * TYPED REDUX HOOKS
 *
 * These are typed versions of the standard Redux hooks.
 * They provide better TypeScript autocomplete and type checking.
 *
 * Instead of using:
 * - useDispatch() and useSelector()
 *
 * Use these:
 * - useAppDispatch() and useAppSelector()
 *
 * They're exactly the same, just with TypeScript types added.
 */

import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

/**
 * useAppDispatch
 * A typed version of useDispatch hook
 *
 * Usage in component:
 * const dispatch = useAppDispatch();
 * dispatch(boardsFetchRequest('user123'));
 */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

/**
 * useAppSelector
 * A typed version of useSelector hook
 *
 * Usage in component:
 * const boards = useAppSelector((state) => state.boards.boards);
 * const loading = useAppSelector((state) => state.boards.loading);
 *
 * TypeScript will autocomplete state.boards. and show all available properties!
 */
export const useAppSelector = useSelector.withTypes<RootState>();
