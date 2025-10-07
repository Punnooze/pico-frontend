/**
 * REDUX PROVIDER WRAPPER
 *
 * In Next.js 13+ with App Router, we need to use Client Components for Redux.
 * The Provider makes the Redux store available to all components in the app.
 *
 * "use client" directive tells Next.js this is a Client Component
 * (runs in the browser, not on the server during SSR)
 */

"use client";

import { Provider } from "react-redux";
import store from "./store";

/**
 * ReduxProvider component
 * Wraps children with Redux Provider
 *
 * The Provider component:
 * - Takes the store as a prop
 * - Makes the store available to all child components
 * - Uses React Context under the hood
 *
 * Any component inside <ReduxProvider> can:
 * - Access state with useAppSelector()
 * - Dispatch actions with useAppDispatch()
 */
export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider store={store}>{children}</Provider>;
}
