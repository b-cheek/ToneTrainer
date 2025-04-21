import { renderRouter, screen, waitFor } from 'expo-router/testing-library';

import Exercise from "../exercises/[id]";
import { Exercises } from '@/constants/Exercises';
import { getRndInt } from '@/utils/Math';

jest.mock("@/components/GlobalsProvider");
jest.mock("react-native-webview", () => {
    const { View } = require('react-native');
    return {
        WebView: View
    };
});
jest.mock("@/components/SheetMusicPreview", () => jest.fn());
jest.mock("expo-font");

test("Answer choices render on exercise page", async () => {
    const exercises = Object.entries(Exercises);
    const [id, exercise] = exercises[getRndInt(0, exercises.length - 1)];

    const mockFileSystem: Record<string, typeof Exercise> = {};
    const url = `exercises/${id}`;
    mockFileSystem[url] = Exercise;
    renderRouter(mockFileSystem, { initialUrl: `${url}?id=${id}` });

    for (const choice of exercise.answerChoices) {
        await waitFor(() => screen.getByText(choice));
        expect(screen.getByText(choice)).toBeOnTheScreen();
    }
})