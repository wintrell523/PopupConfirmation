import popupContent from "../fixtures/popupContent.json";

describe("Popup", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should be shown when page is loaded for first time", () => {
    cy.get("#popup").should("be.visible");
  });

  it("should close once clicked on close button", () => {
    cy.get(".modal-content .close").click();
    cy.get("#popup").should("not.be.visible");
  });

  it("should close once clicked outside the popup", () => {
    cy.get(".modal-content").click();
    cy.get("#popup").should("not.be.visible");
    cy.get("h1").should("be.visible");
  });

  it.skip("should be not shown when page is reloaded after confirmation", () => {});

  it.skip("should be not shown when page is loaded but it was already confirmed in past 10 minutes", () => {});

  it("should display correct text", () => {
    cy.get("#popup").find("h2").should("have.text", popupContent.message);
  });
});
