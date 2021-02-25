import React, { useState } from 'react';
import { dbService, storageService } from 'fbase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPencilAlt } from '@fortawesome/free-solid-svg-icons';

const Qweet = ({ qweetObj, isOwner }) => {
    const [editing, setEditing] = useState(false);
    const [newQweet, setNewQweet] = useState(qweetObj.text);
    const onDeleteClick = async () => {
        const ok = window.confirm(
            'Are you sure you want to delete this qweet?'
        );
        if (ok) {
            await dbService.doc(`qweets/${qweetObj.id}`).delete();
            await storageService.refFromURL(qweetObj.attachmentUrl).delete();
        }
    };
    const toggleEditing = () => setEditing((prev) => !prev);
    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.doc(`qweets/${qweetObj.id}`).update({
            text: newQweet,
        });
        setEditing(false);
    };
    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setNewQweet(value);
    };
    return (
        <div className="qweet">
            {editing ? (
                <>
                    <form onSubmit={onSubmit} className="container qweetEdit">
                        <input
                            type="text"
                            placeholder="Edit your qweet"
                            value={newQweet}
                            required
                            autoFocus
                            onChange={onChange}
                            className="formInput"
                        />
                        <input
                            type="submit"
                            value="Update Qweet"
                            className="formBtn"
                        />
                    </form>
                    <span onClick={toggleEditing} className="formBtn cancelBtn">
                        Cancel
                    </span>
                </>
            ) : (
                <>
                    <h4>{qweetObj.text}</h4>
                    {qweetObj.attachmentUrl && (
                        <img src={qweetObj.attachmentUrl} alt="img" />
                    )}
                    {isOwner && (
                        <div className="qweet__actions">
                            <span onClick={onDeleteClick}>
                                <FontAwesomeIcon icon={faTrash} />
                            </span>
                            <span onClick={toggleEditing}>
                                <FontAwesomeIcon icon={faPencilAlt} />
                            </span>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Qweet;
