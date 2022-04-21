import pageContent from "../fixtures/pageContent.json";

describe("Demo sites for tracking scripts", () => {
  it("should display correct heading", () => {
    cy.visit("/");

    cy.get("h1").should("exist").and("have.text", pageContent.heading);
    cy.get("p").should("have.text", pageContent.paragraph);
  });
});
