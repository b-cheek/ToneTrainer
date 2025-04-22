import { renderRouter, screen, waitFor } from 'expo-router/testing-library';

import ExerciseList from "../ExerciseList";
import { Categories } from '@/constants/Exercises';
import { getRndInt } from '@/utils/Math';

jest.mock("../GlobalsProvider");

test("Exercise names render in list", async () => {
    const categories = Object.entries(Categories);
    const [category, exercises] = categories[getRndInt(0, categories.length - 1)];
    const MockList = jest.fn(() => <ExerciseList key={category} name={category} exercises={exercises} />);

    renderRouter({index: MockList});

    for (const exercise of exercises) {
        await waitFor(() => screen.getByText(exercise.title));
        expect(screen.getByText(exercise.title)).toBeOnTheScreen();
    }
})