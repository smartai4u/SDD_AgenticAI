# Mission

**Constitution version:** 0.1.0

## Purpose

A web app that records the movement of garbage in and out of a processing facility.

- **Inbound:** when feedstock moves into a facility, record its weight in kilograms and the name of the feedstock producer.
- **Outbound:** when processed feedstock leaves the facility for a sequestration site, record the weight of the processed garbage and the name of the sequestration site.
- Feedstock producers and sequestration sites are chosen from dropdown lists when recording weights.
- Feedstock producers and sequestration sites each have their own CRUD pages.

## Problem solved

TBD. VISION.md describes what is recorded but does not state the problem or the current process being replaced.

## Target users

- **Field data-entry staff:** record weights on mobile devices in the field. The app must be mobile friendly (requirement from Arin, CEO).
- **Desktop data analysts:** analyse the recorded data, primarily on desktop.
- **Producer and site managers:** maintain the feedstock producer and sequestration site lists. TBD whether this is a separate role or the same people as above.

## Success criteria (version 0.1.0)

- **Quick entry on a phone:** a weight can be recorded in the field with few taps.

Other criteria, such as record completeness and desktop analysis usability, were not selected and are not success criteria for this version.

## Non-goals

- **IoT integration (e.g. Viam):** deferred until after version 1.0 to avoid manual weight entry. Not part of this version.
- Other non-goals: TBD.
