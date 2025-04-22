import { renderRouter, screen, waitFor } from 'expo-router/testing-library';

import Index from "../index";
import { Categories } from '@/constants/Exercises';

jest.mock("@/components/GlobalsProvider");

test("Category names render on homepage", async () => {
    renderRouter({index: Index});

    for (const category of Object.keys(Categories)) {
        await waitFor(() => screen.getByText(category));
        expect(screen.getByText(category)).toBeOnTheScreen();
    }
})