import React, {useEffect, useState} from 'react';
import './Players.css';
import {DB_Player} from "../../types/database/models";
import {QuickHitAPI} from "../../api/QuickHitAPI";
import {makeErrorToast} from "../Toast/Toast";

/**
 * QuickHit Players page.
 */
function Players() {
    const [players, setPlayers] = useState<DB_Player[]>([]);

    // Runs on mount
    useEffect(()=> {
        getPlayers();
    }, [])

    const getPlayers = () => {
        const onSuccess = (players: DB_Player[]): void => {
            setPlayers(players);
            console.log(players);
        }

        const onFailure = (error: string) : void => {
            makeErrorToast("Could not get players", error);
        }

        QuickHitAPI.getPlayers(onSuccess, onFailure);
    }

    return (
        <div className="players">
         Players
        </div>
    );
}

export default Players;
