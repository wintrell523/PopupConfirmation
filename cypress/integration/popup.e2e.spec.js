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

  it("should be not shown when page is reloaded after confirmation", () => {
    cy.get("#popup").should("be.visible");
    cy.get("button").contains("confirm").click();
    cy.get("#popup").should("not.be.visible");

    cy.reload();
    cy.get("#popup").should("not.be.visible");
  });

  it("should display correct text", () => {
    cy.get("#popup").find("h2").should("have.text", popupContent.message);
  });
});

describe("Popup with expiry time", () => {
  it("should be not shown when page is loaded but it was already confirmed in past 10 minutes", () => {
    cy.addValidConfirmToken("5");
    cy.visit("/");
    cy.get("#popup").should("not.be.visible");
  });
  it("should be shown when page is loaded and it was confirmed more than 10 minutes ago", () => {
    cy.addInvalidConfirmToken("5");
    cy.visit("/");
    cy.get("#popup").should("be.visible");
  });
});
