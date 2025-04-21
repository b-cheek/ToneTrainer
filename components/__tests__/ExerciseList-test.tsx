import { renderRouter, screen, waitFor } from 'expo-router/testing-library';

import ExerciseList from "../ExerciseList";
import { Categories } from '@/constants/Exercises';
import { getRndInt } from '@/utils/Math';

import Storage from 'expo-sqlite/kv-store';
jest.mock("expo-sqlite/kv-store");

test("Exercise names render in list", async () => {
    const categories = Object.entries(Categories);
    const [category, exercises] = categories[getRndInt(0, categories.length - 1)];
    const MockList = jest.fn(() => <ExerciseList key={category} name={category} exercises={exercises} />);
    const mockedStorage = Storage as jest.Mocked<typeof Storage>;
    mockedStorage.multiGet.mockResolvedValue(exercises.map(ex => [ex.id, null]));

    renderRouter({index: MockList});

    for (const exercise of exercises) {
        await waitFor(() => screen.getByText(exercise.title));
        expect(screen.getByText(exercise.title)).toBeOnTheScreen();
    }
})