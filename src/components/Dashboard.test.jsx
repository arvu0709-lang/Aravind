import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Dashboard from "./Dashboard";

// Mock fetch globally
global.fetch = jest.fn();

describe("Dashboard Component", () => {
  const mockUsers = [
    { id: 1, name: "Alice", role: "Admin", status: "Active", avatar: "A" },
    { id: 2, name: "Bob", role: "User", status: "Active", avatar: "B" },
    { id: 3, name: "Charlie", role: "User", status: "Inactive", avatar: "C" },
  ];

  const mockCounter = { counter: 5 };

  beforeEach(() => {
    fetch.mockClear();
  });

  describe("Loading State", () => {
    it("should render loading state initially", () => {
      fetch.mockImplementation(() => new Promise(() => {}));
      render(<Dashboard />);
      expect(screen.getByText("Loading dashboard...")).toBeInTheDocument();
    });
  });

  describe("Error State", () => {
    it("should render error state when fetch fails", async () => {
      fetch.mockRejectedValue(new Error("Failed to fetch"));
      render(<Dashboard />);
      
      await waitFor(() => {
        expect(screen.getByText(/Error:/)).toBeInTheDocument();
      });
      expect(screen.getByText("Retry")).toBeInTheDocument();
    });
  });

  describe("Successful Data Fetch", () => {
    beforeEach(() => {
      fetch.mockImplementation((url) => {
        if (url.includes("/users")) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockUsers),
          });
        }
        if (url.includes("/counter")) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockCounter),
          });
        }
        return Promise.reject(new Error("Not found"));
      });
    });

    it("should render dashboard title", async () => {
      render(<Dashboard />);
      
      await waitFor(() => {
        expect(screen.getByText("Dashboard")).toBeInTheDocument();
      });
    });

    it("should render subtitle", async () => {
      render(<Dashboard />);
      
      await waitFor(() => {
        expect(screen.getByText("Welcome back! Here's your overview")).toBeInTheDocument();
      });
    });

    it("should render stats cards with correct values", async () => {
      render(<Dashboard />);
      
      await waitFor(() => {
        expect(screen.getByText("Total Users")).toBeInTheDocument();
        expect(screen.getAllByText("3").length).toBeGreaterThan(0);
      });
    });

    it("should render active users count", async () => {
      render(<Dashboard />);
      
      await waitFor(() => {
        const activeLabels = screen.getAllByText("Active");
        expect(activeLabels.length).toBeGreaterThan(0);
      });
    });

    it("should render counter value", async () => {
      render(<Dashboard />);
      
      await waitFor(() => {
        expect(screen.getByText("Counter")).toBeInTheDocument();
      });
    });

    it("should render counter control section", async () => {
      render(<Dashboard />);
      
      await waitFor(() => {
        expect(screen.getByText("Counter Control")).toBeInTheDocument();
      });
    });

    it("should render increment and reset buttons", async () => {
      render(<Dashboard />);
      
      await waitFor(() => {
        const buttons = screen.getAllByRole("button");
        expect(buttons.length).toBeGreaterThanOrEqual(2);
      });
    });

    it("should render search section", async () => {
      render(<Dashboard />);
      
      await waitFor(() => {
        expect(screen.getByText("Search Users")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Search by name or role...")).toBeInTheDocument();
      });
    });

    it("should render user management table", async () => {
      render(<Dashboard />);
      
      await waitFor(() => {
        expect(screen.getByText("User Management")).toBeInTheDocument();
        expect(screen.getByText("Avatar")).toBeInTheDocument();
        expect(screen.getByText("ID")).toBeInTheDocument();
        expect(screen.getByText("Name")).toBeInTheDocument();
        expect(screen.getByText("Role")).toBeInTheDocument();
        expect(screen.getByText("Status")).toBeInTheDocument();
      });
    });

    it("should render user data in table", async () => {
      render(<Dashboard />);
      
      await waitFor(() => {
        expect(screen.getByText("Alice")).toBeInTheDocument();
        expect(screen.getByText("Bob")).toBeInTheDocument();
        expect(screen.getByText("Charlie")).toBeInTheDocument();
      });
    });

    it("should render user roles", async () => {
      render(<Dashboard />);
      
      await waitFor(() => {
        expect(screen.getAllByText("Admin").length).toBeGreaterThan(0);
        expect(screen.getAllByText("User").length).toBeGreaterThan(0);
      });
    });

    it("should render user statuses", async () => {
      render(<Dashboard />);
      
      await waitFor(() => {
        expect(screen.getByText("Inactive")).toBeInTheDocument();
      });
    });

    it("should render user avatars", async () => {
      render(<Dashboard />);
      
      await waitFor(() => {
        const avatars = screen.getAllByText(/^[ABC]$/);
        expect(avatars.length).toBe(3);
      });
    });
  });

  describe("Search Functionality", () => {
    beforeEach(() => {
      fetch.mockImplementation((url) => {
        if (url.includes("/users")) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockUsers),
          });
        }
        if (url.includes("/counter")) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockCounter),
          });
        }
        return Promise.reject(new Error("Not found"));
      });
    });

    it("should render search input", async () => {
      render(<Dashboard />);
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText("Search by name or role...")).toBeInTheDocument();
      });
    });
  });

  describe("Counter Buttons", () => {
    beforeEach(() => {
      fetch.mockImplementation((url) => {
        if (url.includes("/users")) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockUsers),
          });
        }
        if (url.includes("/counter")) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockCounter),
          });
        }
        return Promise.reject(new Error("Not found"));
      });
    });

    it("should render increment button", async () => {
      render(<Dashboard />);
      
      await waitFor(() => {
        const buttons = screen.getAllByRole("button");
        expect(buttons.length).toBeGreaterThanOrEqual(2);
      });
    });

    it("should render reset button", async () => {
      render(<Dashboard />);
      
      await waitFor(() => {
        const buttons = screen.getAllByRole("button");
        expect(buttons.length).toBeGreaterThanOrEqual(2);
      });
    });
  });

  describe("API Calls", () => {
    it("should call users and counter API on mount", async () => {
      fetch.mockImplementation((url) => {
        if (url.includes("/users")) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockUsers),
          });
        }
        if (url.includes("/counter")) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockCounter),
          });
        }
        return Promise.reject(new Error("Not found"));
      });

      render(<Dashboard />);
      
      await waitFor(() => {
        expect(fetch).toHaveBeenCalled();
      });
      
      const calls = fetch.mock.calls;
      const urls = calls.map(call => call[0]);
      expect(urls).toContain("http://localhost:5000/api/users");
      expect(urls).toContain("http://localhost:5000/api/counter");
    });
  });

  describe("Edge Cases", () => {
    it("should render empty state when no users", async () => {
      fetch.mockImplementation((url) => {
        if (url.includes("/users")) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([]),
          });
        }
        if (url.includes("/counter")) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ counter: 0 }),
          });
        }
        return Promise.reject(new Error("Not found"));
      });

      render(<Dashboard />);
      
      await waitFor(() => {
        expect(screen.getByText(/No users found matching/)).toBeInTheDocument();
      });
    });

    it("should render all stat trends", async () => {
      fetch.mockImplementation((url) => {
        if (url.includes("/users")) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockUsers),
          });
        }
        if (url.includes("/counter")) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockCounter),
          });
        }
        return Promise.reject(new Error("Not found"));
      });

      render(<Dashboard />);
      
      await waitFor(() => {
        expect(screen.getByText("+12%")).toBeInTheDocument();
        expect(screen.getByText("+8%")).toBeInTheDocument();
      });
    });
  });
});

