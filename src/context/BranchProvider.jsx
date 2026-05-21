import {
    useEffect,
    useState,
} from "react";

import API from "../services/api";

import BranchContext
    from "./BranchContext";

export function BranchProvider({
    children,
}) {

    const [branches, setBranches]
        = useState([]);

    const [loading, setLoading]
        = useState(true);

    const [selectedBranch, setSelectedBranch]
        = useState(() => {

            return localStorage.getItem(
                "selected_branch_id"
            );

        });

    useEffect(() => {

        const fetchBranches =
            async () => {

                try {

                    const res =
                        await API.get(
                            "/api/branches"
                        );

                    setBranches(
                        res.data.data || []
                    );

                } catch (err) {

                    console.error(err);

                } finally {

                    setLoading(false);

                }
            };

        fetchBranches();

    }, []);

    const changeBranch = (
        branchId
    ) => {

        localStorage.setItem(
            "selected_branch_id",
            branchId
        );

        setSelectedBranch(
            branchId
        );
    };

    return (

        <BranchContext.Provider
            value={{

                branches,
                loading,

                selectedBranch,
                setSelectedBranch,

                changeBranch,
            }}
        >

            {children}

        </BranchContext.Provider>
    );
}