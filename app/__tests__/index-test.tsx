import { renderRouter, screen, waitFor } from 'expo-router/testing-library';

import Index from "../index";
import { Categories } from '@/constants/Exercises';

import Storage from 'expo-sqlite/kv-store';
jest.mock("expo-sqlite/kv-store");

test("Category names render on homepage", async () => {
    const mockedStorage = Storage as jest.Mocked<typeof Storage>;
    mockedStorage.multiGet.mockImplementation((ids: string[]) => Promise.resolve(ids.map(id => [id, null])));

    renderRouter({index: Index});

    for (const category of Object.keys(Categories)) {
        await waitFor(() => screen.getByText(category));
        expect(screen.getByText(category)).toBeOnTheScreen();
    }
})