import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://tcdzmtzjxlljrjivxvmp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjZHptdHpqeGxsanJqaXZ4dm1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODIzNDI4MzIsImV4cCI6MTk5NzkxODgzMn0.NmDc_jGNSiIsVh5uDHW6K5euodVZrzstNwyqmkIGNn0"
);

const handleRegister = async (event, email, password) => {
  event.preventDefault();
  const { user, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });
  if (error) {
    alert(error.message);
  }
};

describe("handleRegister", () => {
  let originalAlert;

  beforeEach(() => {
    originalAlert = global.alert;
    global.alert = jest.fn();
  });

  afterEach(() => {
    global.alert = originalAlert;
  });

  it("Обработка успешной регистрации", async () => {
    const mockEvent = { preventDefault: jest.fn() };
    const mockEmail = "test@example.com";
    const mockPassword = "testpassword";
    const mockUser = { user: { id: 12345 }, error: null };
    supabase.auth.signUp = jest.fn().mockResolvedValue(mockUser);

    await handleRegister(mockEvent, mockEmail, mockPassword);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: mockEmail,
      password: mockPassword,
    });
    expect(global.alert).not.toHaveBeenCalled();
  });

  it("Обработка ошибки регистрации", async () => {
    const mockEvent = { preventDefault: jest.fn() };
    const mockEmail = "test@example.com";
    const mockPassword = "testpassword";
    const mockError = {
      user: null,
      error: { message: "Registration error" },
    };
    supabase.auth.signUp = jest.fn().mockResolvedValue(mockError);

    await handleRegister(mockEvent, mockEmail, mockPassword);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: mockEmail,
      password: mockPassword,
    });
    expect(global.alert).toHaveBeenCalledWith("Registration error");
  });
});
