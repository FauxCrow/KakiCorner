import eventData from "../content/events.json";
import profileData from "../content/profile.json";

// Bump this whenever the JSON files change, so the browser reloads them
const DB_VERSION = "2";

// Copies the JSON files into localStorage on first run (or after a version bump)
function seed() {
    if (localStorage.getItem("db_version") === DB_VERSION) return;

    localStorage.setItem("events", JSON.stringify(eventData.events || []));
    localStorage.setItem("profiles", JSON.stringify(profileData.profiles || []));
    localStorage.removeItem("profile_id");
    localStorage.setItem("db_version", DB_VERSION);
}

function read(key) {
    seed();
    return JSON.parse(localStorage.getItem(key)) || [];
}

function write(key, list) {
    localStorage.setItem(key, JSON.stringify(list));
}

function nextId(list) {
    return list.length > 0 ? Math.max(...list.map((item) => item.id)) + 1 : 1;
}

// ---------- Events ----------

export const getEvents = () => read("events");

export const saveEvents = (events) => write("events", events);

export const getEventById = (id) => getEvents().find((event) => event.id === Number(id));

export const addEvent = (event) => {
    const events = getEvents();
    const newEvent = { ...event, id: nextId(events) };
    saveEvents([...events, newEvent]);
    return newEvent;
};

export const updateEvent = (updatedEvent) => {
    saveEvents(getEvents().map((event) => (event.id === updatedEvent.id ? updatedEvent : event)));
};

export const deleteEvent = (id) => {
    saveEvents(getEvents().filter((event) => event.id !== Number(id)));
};

// ---------- Profiles ----------

export const getProfiles = () => read("profiles");

export const saveProfiles = (profiles) => write("profiles", profiles);

export const getProfileById = (id) => getProfiles().find((profile) => profile.id === Number(id));

export const addProfile = (profile) => {
    const profiles = getProfiles();
    const newProfile = { ...profile, id: nextId(profiles) };
    saveProfiles([...profiles, newProfile]);
    return newProfile;
};

export const updateProfile = (updatedProfile) => {
    saveProfiles(getProfiles().map((profile) => (profile.id === updatedProfile.id ? updatedProfile : profile)));
};

// ---------- Current user ----------

export const getCurrentUserId = () => {
    seed();
    const id = localStorage.getItem("profile_id");
    return id ? Number(id) : null;
};

export const setCurrentUserId = (id) => localStorage.setItem("profile_id", id);

export const getCurrentUser = () => getProfileById(getCurrentUserId());
