import { dbService } from "fbase";
import React, { useState } from "react";

const Qweet = ({ qweetObj, isOwner }) => {
    const [editing, setEditing] = useState(false);
    const [newQweet, setNewQweet] = useState(qweetObj.text);

    const onDeleteClick = async () => {
        const ok = window.confirm(
            "Are you sure you want to delete this qweet ? "
        );

        if (ok) {
            // delete qweet
            await dbService.doc(`qweets/${qweetObj.id}`).delete();
        }
    };

    const toggleEditing = () => setEditing((prev) => !prev);
    const onSubmit = async (e) => {
        e.preventDefault();
        await dbService.doc(`qweets/${qweetObj.id}`).update({
            text: newQweet,
        });

        setEditing(false);
    };
    const onChange = (e) => {
        const {
            target: { value },
        } = e;

        setNewQweet(value);
    };

    return (
        <div>
            {editing ? (
                <>
                    <form onSubmit={onSubmit}>
                        <input
                            type="text"
                            placeholder="Edit your Qweet"
                            value={newQweet}
                            onChange={onChange}
                            required
                        />
                        <input type="submit" value="Update Qweet" />
                    </form>
                    <button onClick={toggleEditing}>Cancel</button>
                </>
            ) : (
                <>
                    <h4>{qweetObj.text}</h4>
                    {qweetObj.attachmentUrl && (
                        <img
                            src={qweetObj.attachmentUrl}
                            width="50px"
                            height="50px"
                        />
                    )}
                    {isOwner && (
                        <>
                            <button onClick={onDeleteClick}>
                                Delete Qweet
                            </button>
                            <button onClick={toggleEditing}>Edit Qweet</button>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default Qweet;
