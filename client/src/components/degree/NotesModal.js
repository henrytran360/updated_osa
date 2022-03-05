import React, { useEffect, useState } from "react";
import {
    Editor,
    EditorState,
    RichUtils,
    getDefaultKeyBinding,
    KeyBindingUtil,
    ContentState,
    convertFromHTML,
} from "draft-js";
import { convertToHTML } from "draft-convert";
import "draft-js/dist/Draft.css";
import { gql, useQuery, useMutation } from "@apollo/client";
import "./NotesModal.css";
import TermNumber from "../../constants/TermNumber";

const BLOCK_TYPES = [
    { label: "H1", style: "header-one" },
    { label: "H2", style: "header-two" },
    { label: "H3", style: "header-three" },
    { label: "H4", style: "header-four" },
    { label: "H5", style: "header-five" },
    { label: "H6", style: "header-six" },
    { label: "Blockquote", style: "blockquote" },
    { label: "UL", style: "unordered-list-item" },
    { label: "OL", style: "ordered-list-item" },
    { label: "Code Block", style: "code-block" },
];

const INLINE_STYLES = [
    { label: "Bold", style: "BOLD" },
    { label: "Italic", style: "ITALIC" },
    { label: "Underline", style: "UNDERLINE" },
    { label: "Monospace", style: "CODE" },
];

const StyleButton = (props) => {
    const onToggle = (e) => {
        e.preventDefault();
        props.onToggle(props.style);
    };
    let className = "RichEditor-styleButton";
    if (props.active) {
        className += " RichEditor-activeButton";
    }
    return (
        <span className={className} onMouseDown={onToggle}>
            {props.label}
        </span>
    );
};

const BlockStyleControls = (props) => {
    const { editorState } = props;
    const selection = editorState.getSelection();
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();

    return (
        <div className="RichEditor-controls">
            {BLOCK_TYPES.map((type /*#__PURE__*/) => (
                <StyleButton
                    key={type.label}
                    active={type.style === blockType}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            ))}
        </div>
    );
};

const InlineStyleControls = (props) => {
    var currentStyle = props.editorState.getCurrentInlineStyle();
    return (
        <div className="RichEditor-controls">
            {INLINE_STYLES.map((type /*#__PURE__*/) => (
                <StyleButton
                    key={type.label}
                    active={currentStyle.has(type.style)}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            ))}
        </div>
    );
};

// Custom overrides for "code" style.
const styleMap = {
    CODE: {
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
        fontSize: 16,
        padding: 2,
    },
};

function getBlockStyle(block) {
    switch (block.getType()) {
        case "blockquote":
            return "RichEditor-blockquote";
        default:
            return null;
    }
}

const FIND_DEGREE_PLAN_BY_ID = gql`
    query findDegreePlan($_id: MongoID!) {
        findDegreePlanById(filter: { _id: $_id }) {
            user {
                _id
                firstName
            }
            customCourse
            draftCourses {
                _id
                course {
                    _id
                    courseNum
                    subject
                    creditsMin
                    longTitle
                    fullCourseName
                    distribution
                    prereqs
                }
            }
            notes
            term
        }
    }
`;

const UPDATE_NOTES = gql`
    mutation updateNotes($_id: MongoID!, $notes: String) {
        updateNotes(record: { notes: $notes }, filter: { _id: $_id }) {
            notes
            _id
        }
    }
`;

export default function NotesModal(props) {
    const { loading, error, data } = useQuery(FIND_DEGREE_PLAN_BY_ID, {
        variables: { _id: props._id },
    });
    const [
        updateNotes,
        { loadingMutationNotes, errorMutationNotes, dataMutationNotes },
    ] = useMutation(UPDATE_NOTES, {
        refetchQueries: () => [
            {
                query: FIND_DEGREE_PLAN_BY_ID,
                variables: {
                    _id: props._id,
                },
            },
        ],
    });
    const [year, setYear] = useState("");
    const [sem, setSem] = useState("");
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));

    useEffect(() => {
        if (data) {
            const blocksFromHTML = convertFromHTML(
                data.findDegreePlanById.notes
            );
            const state = ContentState.createFromBlockArray(blocksFromHTML);
            setEditorState(EditorState.createWithContent(state));
        }
    }, [loading, error, data]);

    const [editorState, setEditorState] = React.useState(() =>
        EditorState.createEmpty()
    );

    const editor = React.useRef(null);
    function focusEditor() {
        editor.current.focus();
    }
    const toggleInlineStyle = (style) => {
        setEditorState(RichUtils.toggleInlineStyle(editorState, style));
    };

    const handleKeyCommand = (command) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            setEditorState(newState);
            return true;
        }
        return false;
    };

    const toggleBlockType = (block) => {
        setEditorState(RichUtils.toggleBlockType(editorState, block));
    };

    const onTab = (e) => {
        setEditorState(RichUtils.onTab(e, editorState, 4));
    };

    let className = "RichEditor-editor";
    var contentState = editorState && editorState.getCurrentContent();
    if (!contentState.hasText()) {
        if (contentState.getBlockMap().first().getType() !== "unstyled") {
            className += " RichEditor-hidePlaceholder";
        }
    }

    useEffect(() => {
        if (props.term) {
            let y = props.term.substring(0, 4);
            let s = props.term.substring(4, 6);
            setSem(TermNumber.get(s));
            setYear(y);
        }
    }, [props.term]);

    const saveNotesToDatabase = () => {
        const notesInHTML = convertToHTML(editorState.getCurrentContent());
        updateNotes({
            variables: {
                _id: props._id,
                notes: notesInHTML,
            },
        });
        alert("Your notes are saved !");
    };
    // useEffect(() => {
    //     const onChangeNotes = async () => {
    //         await delay(2000);
    //         const notesInHTML = convertToHTML(editorState.getCurrentContent());
    //         updateNotes({
    //             variables: {
    //                 _id: props._id,
    //                 notes: notesInHTML,
    //             },
    //         });
    //     };
    //     if (editorState) {
    //         onChangeNotes();
    //     }
    // }, [editorState]);

    return (
        <div className="RichEditor-root">
            <div className="headerNotes">
                <div>
                    <span style={{ fontSize: 20 }}>
                        {year} {sem} Semester Notes
                    </span>
                </div>
                <div className="saveBtn" onClick={saveNotesToDatabase}>
                    Save
                </div>
            </div>
            <BlockStyleControls
                editorState={editorState}
                onToggle={(e) => toggleBlockType(e)}
            />
            <InlineStyleControls
                editorState={editorState}
                onToggle={(e) => toggleInlineStyle(e)}
            />
            <div className={className} onClick={focusEditor}>
                <Editor
                    ref={editor}
                    editorState={editorState}
                    onChange={setEditorState}
                    handleKeyCommand={handleKeyCommand}
                    onTab={onTab}
                    blockStyleFn={getBlockStyle}
                    customStyleMap={styleMap}
                    placeholder="Write something!"
                    ref={editor}
                />
            </div>
        </div>
        // <div className="notesContent" onClick={focusEditor}>
        //     <div className="inline-style-options">
        //         Inline Styles:
        //         {inlineStyleButtons.map((button) => {
        //             return renderInlineStyleButton(button.value, button.style);
        //         })}
        //     </div>

        //     <div className="block-style-options">
        //         Block Types:
        //         {blockTypeButtons.map((button) => {
        //             return renderBlockButton(button.value, button.block);
        //         })}
        //     </div>
        //     <button onClick={onSaveNotes}>Save Notes</button>
        //     <Editor
        //         ref={editor}
        //         editorState={editorState}
        //         onChange={setEditorState}
        //         handleKeyCommand={handleKeyCommand}
        //         keyBindingFn={keyBindingFunction}
        //         onTab={onTab}
        //         wrapperClassName="wrapper-class"
        //         editorClassName="editor-class"
        //         toolbarClassName="toolbar-class"
        //         placeholder="Write something!"
        //     />
        // </div>
    );
}
