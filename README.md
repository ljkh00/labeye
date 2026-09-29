# SOC Lab FYP — Centralised Security Lab Transformation

A multi-phase Final Year Project initiative to transform a physical university computer lab into a centralised, 
virtualised Security Operations Centre (SOC) training environment.

## Navigation
Browse the live project site: https://ljkh00.github.io/labeye

## Lab Hardware
| Node | Spec | Role |
|------|------|------|
| Dell R440 | 128 GB RAM, 3 TB HDD, Proxmox | Master control plane, image store, SIEM hub |
| 10× Acer Predator | Proxmox installed | Edge hypervisors — host vulnerable target VMs |
| 20× Lenovo Desktop | Windows 11 | Attacker / Defender stations (class-configurable) |

## Project Phases

| ID | Title | Status |
|----|-------|--------|
| [FYP-1A](fyp1a.html) | Virtualisation Infrastructure & Image Management | ✅ Active — **Prerequisite for all phases** |
| [FYP-1B](fyp1b.html) | Network Segmentation & Security Architecture | ✅ Active |
| [FYP-1C](fyp1c.html) | Lab Automation Framework | ✅ Active |
| [FYP-2A](fyp2a.html) | Security Monitoring Stack (Wazuh XDR) | ✅ Active |
| [FYP-2B](fyp2b.html) | Red Team Attack Automation | ✅ Active |
| [FYP-2C](fyp2c.html) | Blue Team Defence Lab | ✅ Active |
| [FYP-3A](fyp3a.html) | Honeypot Deployment & Threat Intelligence | ✅ Active |
| [FYP-3B](fyp3b.html) | IDS/IPS Integration & Tuning | ⏸️ Deferred — Pending student intake |

## Tech Stack
- **Hypervisor:** Proxmox VE (Dell R440 + 20× Acer nodes)
- **Firewall / Routing:** OPNsense (pfSense migration in progress)
- **Monitoring / XDR:** Wazuh (interim); Palo Alto XDR under evaluation
- **Automation:** Terraform + Ansible + GitHub CI/CD + Python (Flask dashboard)
- **Attack Platform:** Kali Linux via VirtualBox on Lenovo stations
- **DFIR:** Encase (licensed via Dell server)

## Dependency Rule
> **FYP-1A must be completed before any Phase 2 or Phase 3 work begins.**  
> All VM images originate from FYP-1A's golden image repository on the Dell R440.

