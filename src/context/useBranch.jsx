import {
    useContext,
} from "react";

import BranchContext
    from "./BranchContext";

export function useBranch() {

    return useContext(
        BranchContext
    );
}