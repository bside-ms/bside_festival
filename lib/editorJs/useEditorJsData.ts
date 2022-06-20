import type EditorJsData from 'lib/editorJs/EditorJsData';

const useEditorJsData = (rawData: string | null): EditorJsData | null => {

    return rawData === null ? null : JSON.parse(rawData) as EditorJsData;
};

export default useEditorJsData;
